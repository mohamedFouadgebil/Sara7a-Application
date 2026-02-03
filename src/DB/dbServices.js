export const findOne = async({
    model,
    filter = {},
    populate = [],
    select = ""
} = {})=>{ 
    return await model.findOne(filter).populate(populate).select(select)
}

export const findById = async({
    model,
    id = {},
    populate = [],
    select = ""
} = {})=>{ 
    return await model.findById(id).populate(populate).select(select)
}

export const find = async({
    model,
    populate = [],
} = {})=>{ 
    return await model.find().populate(populate)
}

export const create = async({
    model,
    data = [{}],
    options = {validateBeforeSave : true}
} = {})=>{ 
    return await model.create(data,options)
}

export const updateOne = async({
    model,
    filter = {},
    data = {},
    options = {runValidators : true}
})=>{
    return await model.updateOne(filter,data,options)
}

export const findByIdAndUpdate = async({
    model,
    id = "",
    data = {},
    options = {new : true , runValidators : true}
})=>{
    return await model.findByIdAndUpdate(id,data,options)
}

export const findOneAndUpdate = async({
    model,
    filter = {},
    data = {},
    options = {new : true , runValidators : true}
} = {})=>{
    return await model.findOneAndUpdate(filter,data,options)
}