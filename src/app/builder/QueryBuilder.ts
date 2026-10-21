import { type FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
     public modelQuery: Query<T[], T>;
     public query: Record<string, unknown>;

     constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
          this.modelQuery = modelQuery;
          this.query = query;
     }

     search(searchableFields: string[]) {
          const searchTerm = this?.query?.searchTerm;
          if (searchTerm) {
               this.modelQuery = this.modelQuery.find({
                    $or: searchableFields.map((field) => ({
                         [field]: { $regex: searchTerm, $options: 'i' },
                    }) as FilterQuery<T>,
                    ),
               });
          }

          return this;
     }

     filter() {
          const queryObj = { ...this.query }; 

          // Exclude non-filter fields
          const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields', 'startDate', 'endDate', 'dateField', 'minPrice', 'maxPrice'];
          excludeFields.forEach((el) => delete queryObj[el]);

          const filterConditions: Record<string, any> = {};

          Object.keys(queryObj).forEach((key) => {
               if (queryObj[key] !== undefined && queryObj[key] !== '' && queryObj[key] !== 'all') {
                    filterConditions[key] = queryObj[key];
               }
          });

          // Date-wise filtering support
          if (this.query.startDate || this.query.endDate) {
               const dateField = (this.query.dateField as string) || 'createdAt';
               filterConditions[dateField] = filterConditions[dateField] || {};
               if (this.query.startDate) {
                    filterConditions[dateField]['$gte'] = new Date(this.query.startDate as string);
               }
               if (this.query.endDate) {
                    const end = new Date(this.query.endDate as string);
                    end.setHours(23, 59, 59, 999);
                    filterConditions[dateField]['$lte'] = end;
               }
          }

          this.modelQuery = this.modelQuery.find(filterConditions as FilterQuery<T>);
          return this;
     }
      
     sort() {
          const sort =
               (this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt';
          this.modelQuery = this.modelQuery.sort(sort as string);

          return this;
     }

     paginate() {
          const page = Math.max(1, Number(this?.query?.page) || 1);
          const limit = Math.max(1, Number(this?.query?.limit) || 10);
          const skip = (page - 1) * limit;

          this.modelQuery = this.modelQuery.skip(skip).limit(limit);

          return this;
     }

     fields() {
          const fields =
               (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

          this.modelQuery = this.modelQuery.select(fields);
          return this;
     }
     async countTotal() {
          const totalQueries = this.modelQuery.getFilter();
          const total = await this.modelQuery.model.countDocuments(totalQueries);
          const page = Number(this?.query?.page) || 1;
          const limit = Number(this?.query?.limit) || 10;
          const totalPage = Math.ceil(total / limit);

          return {
               page,
               limit,
               total,
               totalPage,
          };
     }
}

export default QueryBuilder;