class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "limit", "sort", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    /* Advanced filtering using operators */
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    this.query = this.query.sort(this.queryString.sort || "createdAt");
    return this;
  }
  fields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    }
    return this;
  }
  paginate() {
    const pageNo = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skipValue = (pageNo - 1) * limit;

    this.query = this.query.skip(skipValue).limit(limit);
    return this;
  }
}
module.exports = APIFeatures;
