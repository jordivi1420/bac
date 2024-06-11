class ApiFactures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            nombre: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {};
        console.log(keyword);
        this.query = this.query.find({ ...keyword });
        return this;
    }

    filter(){
    const queryCopy = {...this.queryStr}
    const removeField = ['keyword','limit','page']
    removeField.forEach(el=> delete queryCopy[el]);
    console.log(queryCopy);
    //filtro por precio rango
    let queryStr = JSON.stringify(queryCopy)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match=> `$${match}`)
    console.log(queryCopy);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
    }
    pagination(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage*(currentPage-1)
        this.query = this.query.limit(resPerPage).skip(skip)
        return this
    }
}

module.exports = ApiFactures;
