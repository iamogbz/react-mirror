import "snapshot-diff/extend-expect";
import * as Adapter from "enzyme-adapter-react-16";
import * as Enzyme from "enzyme";
Enzyme.configure({ adapter: new Adapter() });
