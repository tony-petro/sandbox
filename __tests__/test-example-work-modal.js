import React from 'react';
import {shallow} from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import ExampleWorkModal from '../.js/example-work-modal';

const myExample = {
    'title': "Serverless",
    'href': "http://example.com",
    'desc': "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    'image': {
      'desc': "example screenshot of a project involving code",
      'src': "images/example1.png",
      'comment': ""
  }
};

configure({ adapter: new Adapter() });

describe("ExampleWorkModal component", () => {
  let component = shallow(<ExampleWorkModal example={myExample}
    open={false}/>);
  let openComponent = shallow(<ExampleWorkModal example={myExample}
    open={true}/>);
  let anchors = component.find("a");

  it("Should contain a single 'a' element", () => {
    expect(anchors.length).toEqual(1);
  });

  it("Should link to our project", () => {
    //        Something got depracated in React 16 which made the below line
    //        incompatible so I changed it to the one below it
    //        This is the same error as in test-example-work.js.  So seems like it may be related to an array (last time images, this time anchors)
    //    expect(anchors.node.props.href).toEqual(myExample.href);
    expect(anchors.getElement(0).props.href).toEqual(myExample.href);
  });

  it("Should have the modal class set correctly", () => {
    expect(component.find(".background--skyBlue").hasClass("modal--closed")).toBe(true);
    expect(openComponent.find(".background--skyBlue").hasClass("modal--open")).toBe(true);
  });
});
