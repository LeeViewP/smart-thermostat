function findDeepInObjectByArrayOfProperties(obj, arrayOfPropertyes) {
    if (!obj) return;
    if (arrayOfPropertyes.length < 1) return obj;
    const [property] = arrayOfPropertyes;
    const restOfProperties = [...arrayOfPropertyes].slice(1);
    if (restOfProperties.length > 0) return findDeepInObjectByArrayOfProperties(obj[property], restOfProperties);
    else return obj[property];
}

function responseReturn(req, res, item) {
    return res.status(item ? 200 : 404).send(item ? item : `Sorry, cant find that id: ${req.params.id}`);
}

module.exports = {
    findDeepInObjectByArrayOfProperties,
    responseReturn
}