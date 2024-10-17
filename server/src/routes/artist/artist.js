const test = async (req, res) => {
    return res.status(200).json({"msg": "it works!!!!!!!!!!"});
}

const aaa = async (req, res) => {
    return res.status(200).json({"msg": "aaa!!!!!!!!"});
}

export { test, aaa };