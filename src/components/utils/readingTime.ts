export default (post:any) => {
    if(!post)
        return "";
    const WPM = 200;
    const countWords = (str:string) => str.trim().split(/\s+/).length;
    const content = post?.body;
    const minutes = Math.ceil(countWords(content)/WPM);
    
    return `${minutes} min read`
}