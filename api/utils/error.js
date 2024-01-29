export const HandleError = (res, statusCode, message) =>{
    res.status(statusCode).json({ success: false, status: statusCode, message: message });
}