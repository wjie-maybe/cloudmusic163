;(function () {
    axios.defaults.baseURL = 'http://music.it666.com:3666';
    axios.defaults.timeout = 3000;
    class WJHttp{
        static get(url="",data={}){
            return new Promise(function (resolve, reject) {
                axios.get(url, {
                    params: data
                })
                    .then(function (response) {
                        resolve(response.data)
                    })
                    .catch(function (error) {
                        reject(error)
                    });
            })
        }
        static post(url="",data={}){
            return new Promise(function (resolve, reject) {
                axios.post(url, {
                    params:data
                })
                    .then(function (response) {
                        resolve(response.data)
                    })
                    .catch(function (error) {
                        reject(error);
                    });
            })
        }
    }
    class HomeApis{
        static getHomeBanner(){
            return WJHttp.get('/banner',{type:2})
        }
        static getHomeRecommend(){
            return WJHttp.get("/personalized", {offset: 0, limit:6});
        }
        static getHomeExclusive(){
            return WJHttp.get("/personalized/privatecontent");
        }
        static getHomeAlbum(){
            return WJHttp.get("/top/album", {offset: 0, limit:6});
        }
        static getHomeMV(){
            return WJHttp.get("/personalized/mv");
        }
        static getHomeDJ(){
            return WJHttp.get("/personalized/djprogram");
        }
        static  getHomeHotDetail(){
            return WJHttp.get("/search/hot/detail");
        }
        static getHomeSearchSuggest(key){
            return WJHttp.get("/search/suggest?keywords="+key+"&type=mobile")
        }
    }
    /*searchDetail数据接口*/
    class SearchApis{
        /*
       keywords: 需要搜索的内容
       offset: 从什么地方开始获取数据
       [1, 2, 3, 4, 5, 6, 7, 8 ,9, 10]
       limit: 从指定的位置开始取多少条数据
       type:
       // 1: 单曲,
       // 10: 专辑,
       // 100: 歌手,
       // 1000: 歌单,
       // 1002: 用户,
       // 1004: MV,
       // 1006: 歌词,
       // 1009: 电台,
       // 1014: 视频,
       // 1018:综合
       * */
        static getSearch(keywords="", offset=0, limit=30, type=1){
            return WJHttp.get("/search",{
                keywords: keywords,
                offset: offset,
                limit: limit,
                type: type
            })
        }
    }
    /*player 数据接口*/
    class MusicApis{
        static getSongDetail(ids){
            return WJHttp.get("/song/detail",{
                ids : ids,
            })
        }
        static getSongUrl(id){
            return WJHttp.get("/song/url",{
                id:id
            })
        }
        static getSongLyric(id){
            return WJHttp.get("/lyric",{
                id:id
            })
    }
    }
    /*电台详情节目数据接口*/
    class DetailApis{
        static getDjRadio(id){
            return WJHttp.get("/dj/detail", {
                rid: id
            });
        }
        /*
        asc: false返回的数据从新到旧
        asc: true返回的数据从旧到新
        * */
        static getProgram(id, asc=false){
            return WJHttp.get("/dj/program", {
                rid: id,
                asc: asc
            });
        }
    }
    window.WJHttp =WJHttp;
    window.HomeApis = HomeApis;
    window.SearchApis = SearchApis;
    window.MusicApis = MusicApis;
    window.DetailApis = DetailApis;
})();
