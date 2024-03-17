video_ = document.getElementById('video')
let video_stat = 1 //0이 hidden 상태, 1이 visible 상태

function video_func() {
    if (video_stat === 0)
    {
        video_.style.visibility = 'visible';
        video_stat = 1;
    }
    else if (video_stat === 1)
    {
        video_.style.visibility = 'hidden';
        video_stat = 0;
    }
}


