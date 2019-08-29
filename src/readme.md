### [Demo](https://uipe0.csb.app/)

### [Github](https://github.com/nicholasengleman/React-Histogram-Slider)

### Features

-   supports negative and positive, or only negative or only positive values
-   supports tooltips
-   responsive, expanding to fill its container

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

-   px distance between each bar

3. getBoundries(function):

-   subscription function returning the min and max of the selected range

```
 <Histogram data={data} barMargin={2} getBoundries={this.getBoundries} />
```

### Changelist

0.1.0

-   fixed many bugs
-   improved responsiveness
-   added tooltips
-   added function for subscribing to selected data

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

### Upcoming

-   bar animation
-   color customization
