import { ElNotification } from "element-plus";

export const notification = (message, title = "Error", duration = 2000) => {
  ElNotification({
    duration,
    title,
    dangerouslyUseHTMLString: true,
    message,
    type: title.toLowerCase(),
  });
};
