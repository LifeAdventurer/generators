function copyResultImageToClipboard() {
  try {
    const root = document.documentElement;
    const backgroundColor = getComputedStyle(root).getPropertyValue('--bg-color');

    htmlToImage.toBlob($("#result-page")[0], {
      skipFonts: true,
      preferredFontFormat: "woff2",
      backgroundColor: backgroundColor, // Set background color dynamically
    }).then((blob) => {
      navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      showCopiedNotice();
      $title.parent().remove();
    }).catch((error) => {
      console.error("Error converting result page to image:", error);
      $title.parent().remove();
    });
  } catch (error) {
    console.error("Error copying result image to clipboard:", error);
  }
}

function showCopiedNotice() {
  const notice = $("<div>", {
    text: "Copied to clipboard!",
    css: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      padding: "10px 20px",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      color: "#fff",
      borderRadius: "5px",
      zIndex: 1000,
    },
  });

  $("body").append(notice);

  setTimeout(() => {
    notice.fadeOut(300, () => {
      notice.remove();
    });
  }, 3000);
}
