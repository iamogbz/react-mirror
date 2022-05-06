export function addDomNode() {
    const domNode = document.createElement("div");
    document.body.appendChild(domNode);
    const node0 = document.createComment("comment node");
    document.appendChild(node0);
    const node1 = document.createElement("div");
    domNode.appendChild(node1);
    node1.className = "class1 one";
    node1.setAttribute("attr", "[value");
    const node2 = document.createElement("span");
    node1.appendChild(node2);
    node2.className = "class2 two";
    const node3 = document.createTextNode("text content");
    domNode.appendChild(node3);
    return domNode;
}

export function addDomStyles() {
    const domStyle = document.createElement("style");
    document.head.appendChild(domStyle);
    domStyle.innerHTML = `
        @charset "utf-8";
        @font-face {
            font-family: "Open Sans";
        }
        body, .mirrorFrame:not(*) {
            font-family: "san-serif";
            font-size: 1.2em;
        }
        :is(::after), ::before {
            position: absolute;
        }
        :where(::slotted(span)) {
            border: none;
        }
        ::after {
            content: '';
        }
        .mirrorFrame::before {
            content: 'mock text';
        }
        .class1.one, .class2.two {
            height: 10px;
        }
        .class2.two {
            font-size: 1.3em;
            display: block;
            width: 40px;
            margin: 0 auto;
        }
        .class3.three::after {
            background: red;
            width: 5px;
            height: 5px;
        }
        .class1.one[attr^="[val"] .class2.two {
            width: 20px;
        }
    `;
    return domStyle;
}
