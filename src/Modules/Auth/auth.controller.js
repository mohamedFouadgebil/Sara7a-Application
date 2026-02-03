import { Router } from "express";
import * as authServices from "./auth.services.js";
import { authentication, authorization, tokenEnum } from "../../Middleware/auth.middleware.js";
import { validation } from "../../Middleware/validation.middleware.js";
import {
    confirmEmailSchema,
    forgetPasswordSchema,
    loginSchema,
    resetPasswordSchema,
    signupSchema,
} from "./auth.validation.js";
import { roleEnum } from "../../DB/Models/user.model.js";
const router = Router();

router.post("/signup", validation(signupSchema), authServices.signup);
router.post("/login", validation(loginSchema), authServices.login);
router.patch(
    "/confirm-email",
    validation(confirmEmailSchema),
    authServices.confirmEmail,
);
router.post("/revoke-token", authentication({tokenType : tokenEnum.ACCESS}), authServices.logout);
router.post("/refreash-token", authentication({tokenType : tokenEnum.REFRESH}) , authorization({accessRole : roleEnum.USER}) ,authServices.refreashToken);
router.patch("/update-password", authentication({ tokenType: tokenEnum.ACCESS }),
        authorization({ accessRole: [roleEnum.USER] }), authServices.updatePassword);
router.patch(
    "/forget-password",
    validation(forgetPasswordSchema),
    authServices.forgetPassword,
);
router.patch(
    "/reset-password",
    validation(resetPasswordSchema),
    authServices.resetPassword,
);
router.post("/social-login", authServices.loginWithGoogle);

export default router;
