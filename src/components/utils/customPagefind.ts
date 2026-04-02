import Alpine from "alpinejs";
let currPage = 1;

const resultsLoaded = new CustomEvent("results-loaded", {
  bubbles: true, // Allows the event to bubble up the DOM
  cancelable: true // Allows the event to be canceled with preventDefault()
});

const placeholderTemplate = () => {
    const placeholder = (max = 30) => {
        return ". ".repeat(Math.floor(10 + Math.random() * max));
    };

    return `<li class="pagefind-modular-list-result">
    <div class="pagefind-modular-list-thumb" data-pfmod-loading></div>
    <div class="pagefind-modular-list-inner">
        <p class="pagefind-modular-list-title" data-pfmod-loading>${placeholder(30)}</p>
        <p class="pagefind-modular-list-excerpt" data-pfmod-loading>${placeholder(40)}</p>
    </div>
</li>`;
}

const templateNodes = (templateResult:any) => {
    if (templateResult instanceof Element) {
        return [templateResult];
    } else if (Array.isArray(templateResult) && templateResult.every(r => r instanceof Element)) {
        return templateResult;
    } else if (typeof templateResult === "string") {
        const wrap = document.createElement("div") as HTMLElement;
        
        wrap.innerHTML = templateResult;
        return [...wrap.childNodes]
    } else {
        console.error(`[Pagefind ResultList component]: Expected template function to return an HTML element or string, got ${typeof templateResult}`);
        return [];
    }
}

export class ResultCustom {
    rawResult;
    placeholderNodes;
    resultFn;
    intersectionEl;
    result:any;
    constructor(opts = {}) {
        this.rawResult = opts.result;
        this.placeholderNodes = opts.placeholderNodes;
        this.resultFn = opts.resultFn;
        this.intersectionEl = opts.intersectionEl;
        this.result = null;
        this.load();
    }

    async load() {
        if (!this.placeholderNodes?.length) return;

        this.result = await this.rawResult.data();
        const resultTemplate = this.resultFn(this.result);
        const resultNodes = templateNodes(resultTemplate);

        while (this.placeholderNodes.length > 1) {
            this.placeholderNodes.pop().remove();
        }

        this.placeholderNodes[0].replaceWith(...resultNodes);
    }
}

export class ResultListCustom {
    intersectionEl:any;
    containerEl:any;
    results:any;
    placeholderTemplate:any;
    resultTemplate:any;
    perPage:any;
    constructor(opts:any) {
        this.intersectionEl = document.body;
        this.containerEl = null;
        this.results = [];
        this.placeholderTemplate = opts.placeholderTemplate ?? placeholderTemplate;
        this.resultTemplate = opts.resultTemplate ?? searchResultTemplate;
        this.perPage = opts.perPage ?? 8;

        if (opts.containerElement) {
            this.initContainer(opts.containerElement);
        } else {
            console.error(`[Pagefind ResultList component]: No selector supplied for containerElement`);
            return;
        }
    }

    initContainer(selector:any) {
        const container = document.querySelector(selector);
        
        if (!container) {
            console.error(`[Pagefind ResultList component]: No container found for ${selector} selector`);
            return;
        }

        this.containerEl = container;
    }

    append(nodes:any) {
        for (const node of nodes) {
            this.containerEl.appendChild(node);
        }
    }

    register(instance:any) {
        instance.on("results",async (results:any) => {
            currPage = Alpine.store("search").currentPage;
            const sort = Alpine.store("search").sort;
            
            console.log("sort",sort);
            if (!this.containerEl) return;
            this.containerEl.innerHTML = "";
            const totalLength = results.results.length;
            const resultsData = [];

            for(const result of results.results)
            {
                let obj = {};
                let data = await result.data();
                obj.date = new Date(data.meta.date);
                obj.result = result;
                resultsData.push(obj);
            }

            resultsData.sort((a,b) => {
                if(sort === "oldest-first")
                    return (a.date < b.date) ? -1 : 1;
                else if(sort === "most-recent")
                    return (a.date < b.date) ? 1 : -1;
            })
            
            const pageResults = resultsData.map(x => x.result).slice((currPage-1) * this.perPage,(currPage)*this.perPage);
            
            Alpine.store('search').totalPages = Math.ceil(totalLength/this.perPage);

            this.results = pageResults.map((r:any) => {
                const placeholderNodes = templateNodes(this.placeholderTemplate());
                
                this.append(placeholderNodes);
                return new ResultCustom({ result: r, placeholderNodes, resultFn: this.resultTemplate, intersectionEl: this.intersectionEl });
            })

            document.dispatchEvent(resultsLoaded);
        });

        instance.on("loading", () => {
            if (!this.containerEl) return;
            this.containerEl.innerHTML = "";
        });
    }
}
export const searchResultTemplate = (result:any) => {
    console.log(result);
    const template = document.getElementById("card-template");
    
    if(template)
    {
        const link = template.querySelector(`[data-pagefind-field=link]>a`) as HTMLAnchorElement;

        if(link)
            link.href = result.url;

        const heading = template.querySelector(`[data-pagefind-field=title] .heading-text`) as HTMLElement;
        
        if(heading)
            heading.innerText = result.meta.title;

        const image = template.querySelector(`[data-pagefind-field=image] img`) as HTMLImageElement;
        
        if(image)
            image.src = result.meta.image;

        const topic = template.querySelector(`[data-pagefind-field=topic]`) as HTMLElement;
        
        if(topic)
            topic.innerText = result.meta.topic

        const description = template.querySelector(`[data-pagefind-field=description] .simple-text-inner`) as HTMLElement;
        
        if(description)
            description.innerText = result.meta.description;

        const date = template.querySelector(`[data-pagefind-field=date] .feature-date .simple-text-inner`) as HTMLElement;
        
        if(date)
            date.innerText = new Date(result.meta.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            })

        const readingTime = `${Math.ceil(result.word_count / 200)} min read`;
        const minutesRead = template.querySelector(`[data-pagefind-field=date] .reading-time .simple-text-inner`) as HTMLElement;
        
        if(minutesRead)
            minutesRead.innerText = readingTime;
    }
    return template?.innerHTML;
};