const extState = {
  firstLoad: 1,
  authorColors: [],
};

function randColor() {
  let colorRGB = "rgb(";

  colorRGB += Math.floor(Math.random() * 255) + ",";
  colorRGB += Math.floor(Math.random() * 255) + ",";
  colorRGB += Math.floor(Math.random() * 255);

  colorRGB += ")";

  return colorRGB;
}

function setElStyle(el, color) {
  // el.style.display = "inline-block";
  // el.style.padding = "4px";
  el.style.borderRadius = "2px";
  // el.style.backgroundColor = color;
  el.style.fontSize = "15px";
  el.style.color = color;
  // el.style.color = "white";
}

let observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    let index = null;

    if (extState.firstLoad === 1) {
      extState.firstLoad = 0;
      document.querySelectorAll("#chat #items #author-name").forEach((el) => {
        if ((index = extState.authorColors.findIndex((item) => item.authorName === el.textContent)) !== -1) {
          extState.authorColors[index].count++;

          setElStyle(el, extState.authorColors[index].color);
        } else {
          const color = randColor();

          extState.authorColors.push({ authorName: el.textContent, color, count: 1 });

          setElStyle(el, color);
        }
      });
    }

    for (let i = 0; i < mutation.removedNodes.length; i++) {
      let node = mutation.removedNodes[i];

      if (node.id === "author-name") {
        if ((index = extState.authorColors.findIndex((el) => el.authorName === node.textContent)) !== -1) {
          if (extState.authorColors[index].count-- === 0) {
            extState.authorColors.splice(index, 1);
          }
        }
      }
    }

    if (!mutation.addedNodes.length === 0) return;

    for (let i = 0; i < mutation.addedNodes.length; i++) {
      let node = mutation.addedNodes[i];

      if (node.id === "author-name") {
        if ((index = extState.authorColors.findIndex((el) => el.authorName === node.textContent)) !== -1) {
          extState.authorColors[index].count++;

          setElStyle(node, extState.authorColors[index].color);
        } else {
          const color = randColor();

          extState.authorColors.push({ authorName: node.textContent, color, count: 1 });

          setElStyle(node, color);
        }
      }
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false,
});
