(function(){
    var $video,
        $canvas,
        context,
        $button,
        $loading,
        $success;

    function init() {
        $video = $('video');
        $canvas = $('canvas');
        context = $canvas.get(0).getContext('2d');
        $button = $('#captureButton');
        $loading = $('#loading');
        $success = $('#success');

        navigator.getMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia ||
                               navigator.mozGetUserMedia || navigator.msGetUserMedia);
        
        navigator.getMedia( {video:true}, setupVideo );
        $button.click(capture);
    }

    function setupVideo(stream) {
        $video.attr('src', window.URL.createObjectURL(stream));
    }

    function capture() {
        $button.hide();
        $loading.show();
        $video.get(0).pause();
        $canvas.attr({width:$video.width(), height:$video.height()});
        context.drawImage($video.get(0), 0, 0);
        upload();
    }

    function upload() {
        var headers = {};
        
        $.ajax(
            'https://api.imgur.com/3/upload',
            {
                type: 'POST',
                data : {
                    image:$canvas.get(0).toDataURL('image/png').replace('data:image/png;base64,', ''),
                    type:'base64'
                },
                headers : {
                    'Authorization' : 'Client-ID 944dc2d94336ad9'
                },
                success : success
            }
        );
    }

    function success(e) {
        $loading.hide();
        $success.find('a').attr('href', e.data.link);
        $success.show();
    }

    $(document).ready(init);
})();



