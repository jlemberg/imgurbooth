(function(){
    var $video,
        $canvas,
        context,
        $button,
        $loading,
        $success,
        $countdown,
        $countdown_number,
        $flash,
        $flash_overlay,
        $hideme;

    var countdownAt = 3;

    function init() {
        $video = $('video');
        $canvas = $('canvas');
        context = $canvas.get(0).getContext('2d');
        $button = $('#captureButton');
        $loading = $('#loading');
        $success = $('#success');
        $countdown = $('#countdown');
        $countdown_number = $('#countdown_number');
        $flash = $('#flash');
        $flash_overlay = $('#flash_overlay');
        $hideme = $('#hideme');

        navigator.getMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia ||
                               navigator.mozGetUserMedia || navigator.msGetUserMedia);
        
        navigator.getMedia( {video:true}, setupVideo );
        $button.click(buttonClick);
    }

    function setupVideo(stream) {
        $video.attr('src', window.URL.createObjectURL(stream));
    }

    function buttonClick() {
        $hideme.hide();
        if($countdown.is(':checked')) {
            countdown();
        } else {
            shutter();
        }
    }

    function shutter() {
        if($flash.is(':checked')) {
            $flash_overlay.fadeIn(40, function(){
                setTimeout(function(){
                    capture();
                    $flash_overlay.fadeOut(500);
                }, 300);
            });
        } else {
            capture();
        }
    }

    function capture() {
        $video.get(0).pause();
        $canvas.attr({width:$video.width(), height:$video.height()});
        context.drawImage($video.get(0), 0, 0);
        upload();
    }

    function upload() {
        var headers = {};
        
        $loading.show();

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

    function countdown() {
        if(countdownAt == 0) {
            $countdown_number.hide();
            shutter();
        } else {
            $countdown_number.show();
            $countdown_number.text(countdownAt--);
            setTimeout(countdown, 1000);
        }
    }

    function success(e) {
        $loading.hide();
        $success.find('a').attr('href', e.data.link);
        $success.show();
    }

    $(document).ready(init);
})();



