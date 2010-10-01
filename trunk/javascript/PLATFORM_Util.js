/**
 * Singleton instance.
 */
function Util()
{

    // Self reference
    var me = this;

    if (Util.prototype.constructed != true)
    {
        Util.prototype.getDateObject = function(dateString)
        {
            //Example: 2009-02-27T06:24:33UTC

            var dateTimeArray = dateString.split("T");
            //Result:
            //2009-02-27
            //06:24:33U
            //C

            var dateArray = dateTimeArray[0].split("-");
            //Result:
            //2009
            //02
            //27

            var time = dateTimeArray[1].slice(0, dateTimeArray[1].length - 1);
            //Result:
            //06:24:33

            /* Uncomment to aid debugging
            log.debug("Date: " + dateTimeArray[0]);
            log.debug("Time: " + time);
            */

            var timeArray = time.split(":");
            //Result:
            //06
            //24
            //33

            /* Uncomment to aid debugging*/
            /*
            log.debug("Date year: " + dateArray[0]);
            log.debug("Date month: " + dateArray[1]);
            log.debug("Date day: " + dateArray[2]);

            log.debug("Time hour: " + timeArray[0]);
            log.debug("Time min: " + timeArray[1]);
            log.debug("Time sec: " + timeArray[2]);*/
            

            var date = new Date(
                dateArray[0],
                dateArray[1] - 1, //Minus by 1 because January is 0.
                dateArray[2],
                timeArray[0],
                timeArray[1],
                timeArray[2],
                0);

            /* Uncomment to aid debugging
            log.debug("Date object: " + date);
            */
            return date;
        }

        Util.prototype.convertMillisecondsToMinutes = function(lengthInMilliseconds)
        {
            return Math.floor(lengthInMilliseconds / 1000 / 60);
        }

        Util.prototype.isNewlyAvailable = function(startDate)
        {
            var currentDate = new Date();
            var minutesSinceStartTime = me.convertMillisecondsToMinutes(currentDate - startDate);
            if (minutesSinceStartTime < (24 * 60))
                return true
            else
                return false;
        }

        Util.prototype.isExpiringSoon = function(deleteDate)
        {
            var currentDate = new Date();
            var minutesSinceStartTime = me.convertMillisecondsToMinutes(deleteDate - currentDate);
            if (minutesSinceStartTime < (24 * 60))
                return true
            else
                return false;
        }

        Util.prototype.truncateLongText = function(maxLength, text)
        {
            //Perform truncation if channel name too long
            var allowedLength = maxLength;
            var ellipsis = "...";
            if (text.length > allowedLength)
            {
                text = text.substring(0, allowedLength - ellipsis.length);
                text = text + ellipsis;
            }
            return text;
        }

        Util.prototype.constructed = true;
    }
}