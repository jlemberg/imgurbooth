(function(){
    var $video,
        $canvas,
        context,
        $button,
        $loading,
        $success,
        $countdown,
        $countdown_number,
        $seconds,
        $hideme,
        encoder,
        currentFrame,
        $gifOutput;

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
        $seconds = $('#seconds');
        $hideme = $('#hideme');
        $canvas.attr('width', 320);
        $canvas.attr('height', 240);
        $gifOutput = $('#gifoutput');
        encoder = new GIFEncoder();
        currentFrame = 0;

        encoder.setRepeat(0);

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
        encoder.setDelay(50);
        encoder.start();
        frame();
    }

    function frame() {

        context.drawImage($video.get(0), 0, 0, 640, 480, 0, 0, 320, 240);
        encoder.addFrame(context);

        if(++currentFrame == 15) {
            encoder.finish();
            upload();
        } else {
            setTimeout(frame, 100);
        }
    }

    function upload() {
        console.log("would upload now, but won't"); 
        var binary_gif = encoder.stream().getData();
        var data_url = 'data:image/gif;base64,'+encode64(binary_gif);
        $gifOutput.attr('src', data_url);

        return;


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



