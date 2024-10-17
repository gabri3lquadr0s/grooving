const test = async (req, res) => {
    return res.status(200).json({"msg": "it works!!!!!!!!!!"});
}

module.exports = { test };