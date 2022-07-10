/**
 * 粘贴板文本
 * @param text
 */
export const copyText = async (text: string) => {
  try {
    if (navigator.clipboard.writeText) {
      // 默认 clipboard 处理 https://web.dev/async-clipboard/
      await navigator.clipboard.writeText(text);
    } else {
      // 降级处理
      const textField = document.createElement("textarea");
      textField.innerText = text;
      document.body.appendChild(textField);
      textField.select();
      document.execCommand("copy");
      textField.remove();
    }
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};
