/** @jsx h */

// If you read official Babel JSX documentation here , you’ll know, that Babel transpiles this code:
// <div className="box">hello</div>
// Into smth like this:
// React.createElement("div", { className: "box" }, "hello");

// There is smth called jsx pragma in Babel. We just need to include comment-like line at the top of our source file.
// It replaces those React.createElement(…)’s with our h(…)’s calls…

//   Babel transpiles this code:
//   /** @jsx h */        <div className="list">hello</div>
//   Into smth like this:
//   /** @jsx h */        h("div", { className: "list" }, "hello");
//   This is a function call.  We call helper function h with 3 arguments and it returns js object - Dom node representation (similar to react element) 

function h(type, props, ...children){
  return { type, props, children };
}

function createElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }
  const $el = document.createElement(node.type);
  node.children.map(createElement).forEach($el.appendChild.bind($el));
  return $el;
}

function changed(node1, node2) {
  return typeof node1 !== typeof node2 || typeof node1 === 'string' && node1 !== node2 || node1.type !== node2.type
}

function updateElement($parent, newNode, oldNode, index = 0) {
  if (!oldNode) {
    $parent.appendChild(
      createElement(newNode)
    );
  } else if (!newNode) {
    $parent.removeChild(
      $parent.childNodes[index]
    );
  } else if (changed(newNode, oldNode)) {
    $parent.replaceChild(
      createElement(newNode),
      $parent.childNodes[index]
    );
  } else if (newNode.type) {
    const newLength = newNode.children.length;
    const oldLength = oldNode.children.length;
    for (let i = 0; i < newLength || i < oldLength; i++) {
      updateElement(
        $parent.childNodes[index],
        newNode.children[i],
        oldNode.children[i],
        i
      );
    }
  }
}