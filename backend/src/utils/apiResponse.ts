export const successResponse = (res: any, data: any, message = "Success") => {
  return res.json({ status: "success", message, data });
};

export const errorResponse = (res: any, message = "Error", code = 400) => {
  return res.status(code).json({ status: "error", message });
};
