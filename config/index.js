module.exports={
    secert:"god bless you",
    qiniu:{
        accessKey:"tSKt3BWJk16uXzV4rmeQ4rlcjjdxctviexyujL7d",
        secertKey:"DlxBS7vlw0zrdpEPTYWLIHvYN5ErichWqdkk0sgP",
        options:{
            scope: "eeg-reports",
            callbackUrl: '',
            callbackBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
            callbackBodyType: 'application/json'
        }
    }
}