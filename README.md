# This component is still in alpha status.
Within the next 7 days I plan to get it to beta status. I don't advise trying it till it is on beta status.

The main feature that sets it apart from other React Histogram Sliders is

-   it supports negative and positive values.
-   it is responsive, expanding to fill its container.

I made the component for a personal project where I am using it to display crypto currency returns. Before it reaches beta I will add props for turning off or customizing the UI and UX of certain features that right now only make sense if you are displaying financial return data.

If you really want to try it out now, the main thing to know is that the data passed to the data prop must be an array of objects and the only required property for each object is a 'value' property.

```
  data = [
     {
       value: 23
     },
     {
         value: 10
     },
     {
         value: -50
     }
  ]
```

### [See Demo Here](https://uipe0.csb.app/)

### Changelist

0.0.1

-   initial publish

0.0.2

-   added default proptypes

0.0.3

-   bug fix

0.0.6

-   bars now take up entire vertical space of histogram

0.0.7

-   bug fix so component will update when new props are passed to it

0.0.8

-   lots of bug fixes

0.0.9

-   updated readme
