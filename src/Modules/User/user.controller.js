import { Router } from "express";
import * as userServices from "./user.services.js";
import {
  authentication,
  authorization,
  tokenEnum,
} from "../../Middleware/auth.middleware.js";
import {
  fileValidation,
  localUploadFile,
} from "../../Utils/Multer/local.multer.js";
import { validation } from "../../Middleware/validation.middleware.js";
import {
  checkAccountSchema,
  coverImageSchema,
  freezedUserSchema,
  profileImageSchema,
  restoreUserSchema,
  verifyAccountSchema,
} from "./user.validation.js";
import { cloudUploadFile } from "../../Utils/Multer/cloud.multer.js";
import { roleEnum } from "../../DB/Models/user.model.js";
const router = Router();

router.patch(
  "/update-user",
  authentication({ tokenType: tokenEnum.ACCESS }),
  authorization({ accessRole: [roleEnum.USER] }),
  userServices.updateUser,
);
router.get("/list-user-data", userServices.listUser);
router.patch(
  "/profile-image",
  authentication({tokenType : tokenEnum.ACCESS}),
  localUploadFile({
    customPath: "User",
    validation: [...fileValidation.images],
  }).single("profileImage"),
  validation(profileImageSchema),
  userServices.profileImage,
);
router.patch(
  "/profile-image-cloud",
  authentication({tokenType : tokenEnum.ACCESS}),
  authorization({ accessRole: roleEnum.USER }),
  cloudUploadFile({
    validation: [...fileValidation.images],
  }).single("profileImage"),
  userServices.profileImageCloud,
);
router.patch(
  "/cover-images",
  authentication({tokenType : tokenEnum.ACCESS}),
  localUploadFile({
    customPath: "User",
    validation: [...fileValidation.images],
  }).array("coverImages", 4),
  validation(coverImageSchema),
  userServices.coverImages,
);
router.patch(
  "/cover-images-cloud",
  authentication,
  cloudUploadFile({
    validation: [...fileValidation.images],
  }).array("coverImages", 5),
  userServices.coverImagesCloud,
);
router.delete(
  "/{:userId}freezed-account",
  authentication({ tokenType: tokenEnum.ACCESS }),
  authorization({ accessRole: [roleEnum.ADMIN, roleEnum.USER] }),
  validation(freezedUserSchema),
  userServices.freezedAccount,
);
router.patch(
  "/:userId/restore-account",
  authentication({ tokenType: tokenEnum.ACCESS }),
  authorization({ accessRole: [roleEnum.ADMIN, roleEnum.USER] }),
  validation(restoreUserSchema),
  userServices.restoredAccount,
);
router.post("/check-account" , validation(checkAccountSchema) , userServices.checkAccount)
router.post("/verify-account" , validation(verifyAccountSchema) , userServices.verifyAccount)

export default router;
