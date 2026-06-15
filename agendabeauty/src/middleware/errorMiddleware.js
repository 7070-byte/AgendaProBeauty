
function errorMiddleware(err, req, res, next) {
 console.error('[ERRO]:', err.stack);
 
 const statusCode = err.statusCode 

 res.status(statusCode).json({
 error: err.message || 'Erro interno no servidor',
 status: statusCode
 });
}
module.exports = errorMiddleware;
