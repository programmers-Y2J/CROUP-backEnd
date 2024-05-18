const resTemplate = {
  JSON(success: boolean, message: string) {
    return { success, message };
  },
};

export default resTemplate;
