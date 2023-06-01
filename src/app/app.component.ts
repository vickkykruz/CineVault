import { Component, OnInit } from '@angular/core';
import { Meta, MetaDefinition } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Netflix_Clone';

  constructor(private spinner: NgxSpinnerService, private meta: Meta) {}

  ngOnInit(): void {
    this.meta.addTags([
      {name: 'keywords', content: 'Cruz Tv || Steam and Download Movies, cruztv, latest movies'},
      {name: 'robots', content: 'index, follow'},
      {name: 'author', content: 'Cruz Tv'},
      {name: 'publisher', content: 'Cruz Tv'},
      {name: 'language',content: 'en'},
      {name: 'revisit-after', content: '7 days'},
      {name: 'distribution', content: 'global'},
      {name: 'rating', content: 'general'},
      {name: 'description', content: 'This is an application that gives you access to the lastest and trending movies accross the world'},
      {name: 'canonical', url: 'https://www.cruztv.netlify.app'},
      {property: 'og:title', content: 'Cruz Tv || Latest and Trending Movies'},
      {property: 'og:description', content: 'This is an application that gives you access to the lastest and trending movies accross the world'},
      {property: 'og:image', itemprop: 'image', content: 'https://www.cruztv.netlify.app/assets/images/logo/OIP.jpeg'},
      {property: 'og:type', content: 'website'},
      {name: 'twitter:card', content: 'summary_large_image'},
      {name: 'twitter:title', content: 'Cruz Tv || Latest and Trending Movies'},
      {name: 'twitter: description', content: 'This is an application that gives you access to the lastest and trending movies accross the world'},
      {name: 'twitter:image', content: 'https://www.cruztv.netlify.app/assets/images/logo/OIP.jpeg'},
      // {name: 'date', content: '2023-01-24', scheme: 'YYYY-MM-DD'},
    ]);

    const schemaJson = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Cruz Tv",
      "description": "This is an application that gives you access to the lastest and trending movies accross the world"
    };
    const scripts = this.metaFactory(`{"props": ${JSON.stringify(schemaJson)} }`);
    const metaDefination: MetaDefinition = { name: 'schema', content: scripts.innerHTML};
    this.meta.addTag(metaDefination);

    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 10000);
  }

  private metaFactory(content: string): HTMLScriptElement {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = content;
    return script;
  }
}
