### [Demo](https://0rdyn.csb.app/)

### [Github](https://github.com/nicholasengleman/React-Histogram-Slider)

### Features

-   supports negative and positive, or only negative or only positive values
-   supports tooltips
-   responsive, fills its container
-   subscribe to filtered data by passing a function to the getBoundries props
-   pass in button/filter presets by passing an object to the buttonPresets prop
-   slider and input can be hidden

### Interface/Props

1. Data Prop(array):

-   Pass an array of objects with a value property to the data prop
-   to enable tooltips, include an array of strings in each object named 'tooltip'. Each string will be a different line in the tooltop. CSS customization for each line coming later.

```
  data = [
     {
       value: 23,
       tooltip: ["Line 1", "Line 2"]
     },
     {
       value: 10,
       tooltip: ["Line 1", "Line 2"]
     },
     {
       value: -50,
       tooltip: ["Line 1", "Line 2"]
     }
  ]
```

2. barMargin Prop(number):

-   percentage of max available space available to bar. 100% means each bar will touch its neighbor. Default is 0.7;

3. getBoundries(function):

-   subscription function returning the min and max of the selected range

4.  buttonPresets prop object for passing in preset positions for the buttons with keys of "selectionMin" and "selectionMax".

        ```
          preSets = {
            selectionMin : 0.1,
            selectionMax : 2
          }
        ```

5) showSlider prop

-   set to false to hide the slider. Default is true.

6. showInputs prop

-   set to false to hide the inputs. Default is true.

7. scaleIncrements prop

-   controls how many numbers appear on the scale. Default is 5.

    ```
    <Histogram data={data}
              barMargin={0.8}
              getBoundries={this.getBoundries}
              buttonPresets={{ "selectionMin" : 0.3, "selectionMax: 2}
              scaleIncrements={3}}
              showSlider={false}
    />
    ```

### Changelist

0.2.0

-   improved tooltips.
-   greatly improved performance
-   added animation to bars
-   added ability to pass in presets via the buttonPresets prop
-   made slider and inputs optional
-   make number of number on scale customizable
-   added proptypes

0.1.0

-   fixed many bugs
-   added tooltips
-   improved responsiveness
-

0.0.9

-   updated readme

0.0.8

-   lots of bug fixes

0.0.7

-   bug fix so component will update when new props are passed to it

0.0.6

-   bars now take up entire vertical space of histogram

0.0.3

-   bug fix

0.0.2

-   added default proptypes

0.0.1

-   initial publish

