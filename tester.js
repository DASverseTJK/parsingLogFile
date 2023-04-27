let str = '{"words":["Pants","Credit","Incredible","Comoro","Analyst","copy","Music","Planner","XML","AGP","hacking","Tasty"]}';

if(str.includes("\{\"words\"\:\[\"")) {
    str = str.trim().split(',');
}
console.log(str);