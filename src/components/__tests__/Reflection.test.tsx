import { act, render } from "@testing-library/react";
import * as React from "react";
import { addDomNode } from "../../__mocks__";
import { getAttributes } from "../../utils/dom";
import { Reflection, mergeStyleProps } from "../Reflection";

describe("Reflection", () => {
    it("reflects nothing", () => {
        const subject = render(<Reflection />);
        expect(subject.baseElement).toMatchInlineSnapshot(`
            <body>
              <div />
            </body>
        `);
    });

    it("reflect text node", () => {
        const domNode = document.createTextNode("text content");
        const subject = render(<Reflection real={domNode} />);
        expect(subject.baseElement).toMatchInlineSnapshot(`
            <body>
              <div>
                text content
              </div>
            </body>
        `);
    });

    it("reflect html element", async () => {
        const domNode = addDomNode();
        const subject = render(<Reflection real={domNode} />);
        expect(subject.baseElement).toMatchInlineSnapshot(`
            <body>
              <div>
                <div
                  attr="[value"
                  class="class1 one"
                >
                  <input
                    class="class2 two"
                  />
                </div>
                text content
              </div>
              <div>
                <div
                  class=""
                  readonly=""
                >
                  <div
                    attr="[value"
                    class="class1 one"
                    readonly=""
                  >
                    <input
                      class="class2 two"
                      readonly=""
                      value="input-value"
                    />
                  </div>
                  text content
                </div>
              </div>
            </body>
        `);
        await act(async () => void domNode.remove());
    });

    it("perseves style prop over element inline style", async () => {
        const domNode = addDomNode();
        domNode.dataset.testId = "test-id";
        const style = {
            color: "red",
            fontSize: "18px",
            borderWidth: "2px",
        };
        domNode.style.color = "blue";
        domNode.style.backgroundColor = "blue";
        domNode.style.border = "solid 1px green";

        const baseElement = document.createElement("div");
        const subject = render(<Reflection real={domNode} style={style} />, {
            baseElement,
        });
        const reflection = subject.getByTestId(
            domNode.dataset.testId,
        ) as HTMLDivElement;

        expect(reflection?.style.color).toEqual("red");
        expect(reflection?.style.backgroundColor).toEqual("blue");
        expect(reflection?.style.borderColor).toEqual("green");
        expect(reflection?.style.borderWidth).toEqual("2px");
        expect(reflection?.style.borderStyle).toEqual("solid");

        await act(async () => void domNode.remove());
    });

    it("perseves all classes from class name and list", async () => {
        const domNode = addDomNode();
        domNode.classList.add("realClsA");
        domNode.classList.add("realClsB");
        domNode.dataset.testId = "test-id";
        const baseElement = document.createElement("div");

        const subject = render(
            <Reflection real={domNode} className="clsReflect reflectionCls" />,
            { baseElement },
        );
        const reflection = subject.getByTestId(
            domNode.dataset.testId,
        ) as HTMLDivElement;

        expect(Array.from(reflection.classList).sort()).toEqual([
            "clsReflect",
            "realClsA",
            "realClsB",
            "reflectionCls",
        ]);

        await act(async () => void domNode.remove());
    });

    it("tracks attribute changes in reflected node", async () => {
        const domNode = addDomNode();
        domNode.dataset.testId = "test-id";
        const baseElement = document.createElement("div");

        const subject = render(<Reflection real={domNode} />, { baseElement });
        const reflection = subject.getByTestId(
            domNode.dataset.testId,
        ) as HTMLDivElement;

        const expectedAttributes = {
            class: "",
            "data-test-id": "test-id",
            readonly: "",
        };
        expect(getAttributes(reflection)).toEqual(expectedAttributes);

        await act(async () => {
            domNode.setAttribute("newAttr", "newValue");
        });
        expect(getAttributes(reflection)).toEqual({
            ...expectedAttributes,
            newattr: "newValue",
        });

        await act(async () => void domNode.remove());
    });

    describe("mergeStyleProps", () => {
        const CSS_STYLE_NONE = document.createElement("span").style;
        const CSS_STYLE_DECL = document.createElement("span").style;
        CSS_STYLE_DECL.borderColor = "red";

        it.each`
            cssProps                   | inlineStyle              | styleDecl         | expectedStyle
            ${{}}                      | ${""}                    | ${CSS_STYLE_NONE} | ${{}}
            ${{}}                      | ${""}                    | ${CSS_STYLE_DECL} | ${{ borderColor: "red" }}
            ${{}}                      | ${"borderColor: green"}  | ${CSS_STYLE_DECL} | ${{ borderColor: "green" }}
            ${{ borderColor: "blue" }} | ${"borderColor: green"}  | ${CSS_STYLE_DECL} | ${{ borderColor: "blue" }}
            ${{ borderWidth: "1px" }}  | ${"border-style: solid"} | ${CSS_STYLE_DECL} | ${{ borderColor: "red", borderStyle: "solid", borderWidth: "1px" }}
        `(
            "creates css style with expected props",
            ({ cssProps, expectedStyle, inlineStyle, styleDecl }) => {
                expect(
                    mergeStyleProps(cssProps, inlineStyle, styleDecl),
                ).toEqual(expectedStyle);
            },
        );
    });
});
