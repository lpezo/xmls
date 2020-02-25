const SystemDao = require('../DAO/systemDAO');

const MarcarInicio = () => {
    return SystemDao.SetInit(true);
};

const MarcarFin = () => {
    return SystemDao.setInit(false);
}

const EsIniciado = () => {
    return SystemDao.isInUse();
}

module.exports = {
    MarcarInicio, MarcarFin, EsIniciado
}