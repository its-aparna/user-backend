import jwt from "jsonwebtoken";

export const verifyToken = (request, response, next) => {
    try {
        let token = request.headers.authorization;
        jwt.verify(token, "qwertyuiop");
        next();

    }
    catch (err) {
        console.log("Inside Catch");
        console.log(err);
        return response.status(401).json({ error: "Unauthorized request", status: false }
        );
    }
}
