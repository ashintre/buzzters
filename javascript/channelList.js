/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function getChannels(){
    //var url = "http://128.61.159.74/IptvPortal/ChannelMapGateway";
/*
                    $.ajax({
                            url: url,
                            dataType: 'xml',
                            success:function(result){cList = fillWidgetList(result);},
                            async: false
                        });
                     console.log(cList);
                     return cList;
*/
     cList = new ChannelMap();
     console.log(cList.getChannelEntryByIndex(2));
}
function fillWidgetList(response){

                       // console.log(response);
                        var jsondata=response;
                        var channelListJson = jsondata;
                        var channelsArray = new Array();

                        for(i=0;i<channelListJson.length;i++){
                            channelsArray[i] = new Object();
                            channelsArray[i].name = channelListJson.widgets[i].stationName;
                            channelsArray[i].stationId = channelListJson.widgets[i].stationId;
                            channelsArray[i].multicastAddress = channelListJson.multicastAddress;
                        }
            //widgets = widgetsArray;
                        console.log(channelsArray);//[2].name+widgetsArray[1].title+ widgetsArray[0].view);
                        return channelsArray;
}

