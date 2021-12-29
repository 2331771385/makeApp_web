export function currentTime() {
    var myDate = new Date();
	var year = myDate.getFullYear();
	var month = myDate.getMonth() + 1;
	var dates = myDate.getDate();
	var currentDate = year + "-" + month + "-" + dates;

    let beforeTime = new Date(myDate.getTime() - 24 * 60 * 60 * 1000 * 7); //一个周前
    let beforeTimeYear = beforeTime.getFullYear();
    let beforeTimeMonth = beforeTime.getMonth() + 1;
    let beforeTimeDay = beforeTime.getDate();
    beforeTimeMonth = beforeTimeMonth < 10 ? "0" + beforeTimeMonth : beforeTimeMonth;
    beforeTimeDay = beforeTimeDay < 10 ? "0" + beforeTimeDay : beforeTimeDay;
	var beforeWeek = beforeTimeYear + '-' + beforeTimeMonth + '-' + beforeTimeDay;
    
    return [beforeWeek, currentDate];
};
export const typeList = [
    {
        id: 3,
        value: '建筑类型'
    },
    {
        id: 4,
        value: '单位类型'
    },
    {
        id: 5,
        value: '服务类型'
    }
]
