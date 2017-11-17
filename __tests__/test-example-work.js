import React from 'react';
import {shallow} from 'enzyme';
import ExampleWork, {ExampleWorkBubble } from '../.js/example-work';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

  const myWork = [
    {
      'title': "Serverless",
      'image': {
        'desc': "example screenshot of a project involving code",
        'src': "images/example1.png",
        'comment': ""
      }
    },
    {
      'title': "You Know Not Never",
      'image': {
        'desc': "example screenshot of a project involving chemistry",
        'src': "images/example4.png",
        'comment': ""
      }
    }
  ];

configure({ adapter: new Adapter() });

  describe("ExampleWork component", () => {
    let component = shallow(<ExampleWork work={myWork} />);

    it("Should be a 'section' element", () => {
      expect(component.type()).toEqual('section');
  });

    it("Should contain as many children as there are work examples", () => {
      expect(component.find("ExampleWorkBubble").length).toEqual(myWork.length);
    });

    describe("ExampleWorkBubble component", () => {
      let component = shallow(<ExampleWorkBubble example={myWork[1]} />);

      let images = component.find("img");
      it("Should contain a single 'img' element", () => {
        expect(images.length).toEqual(1);
      });

      it("Should have the image src set correctly", () => {
//        Something got depracated in React 16 which made the below line
//        incompatible so I changed it to the one below it
//        expect(images.node.props.src).toEqual(myWork[1].image.src);
        expect(images.getElement(0).props.src).toEqual(myWork[1].image.src);
      });
    });
});
