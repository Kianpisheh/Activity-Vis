var arraysEquality = function(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    var arr11 = Array.from(new Set(arr1).values());
    var arr22 = Array.from(new Set(arr2).values());
    var filteredArr1 = arr11.filter(function(el) {
        return !arr22.includes(el);
    });
    if (filteredArr1.length === 0) {
        return true;
    }
    return false;
};
var b = arraysEquality(["pot", "plate", ""], ["plate", "pot"]);
