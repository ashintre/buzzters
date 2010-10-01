/**
 *
 * Object encapsulating the information of a single episode/show.
 *
 */
function EpisodeEntry (
    p_summary,
    p_origAirDate,
    p_title,
    p_resourceId,
    p_subtitle,
    p_rating,
    p_deleteTime,
    p_startTime,
    p_endTime,
    p_assetId,
    p_seriesId,
    p_extAssetId,
    p_duration)
{
    
    var me = this;
    var summary = p_summary;
    var origAirDate = p_origAirDate;
    var title = p_title;
    var resourceId = p_resourceId;
    var subtitle = p_subtitle;
    var rating = p_rating;
    var deleteTime = p_deleteTime;
    var startTime = p_startTime;
    var endTime = p_endTime;
    var assetId = p_assetId;
    var seriesId = p_seriesId;
    var extAssetId = p_extAssetId;
    var duration = p_duration;

    /* ***********************************************************************
	 *                            PUBLIC METHODS                             *
	 * ***********************************************************************/

    me.getStartTime = function () {
        return startTime;
    }

    me.getEndTime = function () {
        return endTime;
    }

    me.getSummary = function () {
        return summary;
    }

    me.getOrigAirDate = function () {
        return origAirDate;
    }

    /**
     * Get show name
     */
    me.getTitle = function () {
        return title;
    }

    me.getResourceId = function () {
        return resourceId;
    }

    /**
     *  Get episode name
     */
    me.getSubtitle = function ()
    {
        return subtitle;
    }

    me.getRating = function ()
    {
        return rating;
    }

    me.getDeleteTime = function ()
    {
        return deleteTime;
    }

    me.getAssetId = function ()
    {
        return assetId;
    }

    me.getObjectType = function ()
    {
        return "EpisodeEntry";    
    }

    me.getSeriesId = function ()
    {
        return seriesId;
    }
    
    me.getExtAssetId = function ()
    {
    	return extAssetId;
    }
    
    me.getDuration = function ()
    {
    	return duration;
    }
}

