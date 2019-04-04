import React, { Component } from 'react';
import Shuffle from 'shufflejs'
import LoadingOverlay from 'react-loading-overlay';
import AOS from 'aos';
import debounce from 'lodash.debounce';
import 'aos/dist/aos.css';
import './InfiniteWall.scss';
import HomepagePost from '../HomepagePost/HomepagePost';

const API = 'http://localhost:4200/';
const POSTS_ENDPOINT = 'posts';
const CATEGORIES_ENDPOINT = 'categories';
const POST_COUNT = 15;
const SCROLL_DEBOUNCE_TIME = 250;

class InfiniteWall extends Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            categories: [],
            hasMore: true,
            isLoading: true
        };

        this.element = React.createRef();
        this.sizer = React.createRef();

        this.currentType = 'all';
        this.currentCategory = 'all';
        this.currentTs = Date.now();

        this._fetchCategories()
            .then((data) => {
                this.setState({ categories: data.categories });
            });

        this._fetchPostsOnScrollDebounced = debounce(() => {
            this._fetchPosts()
                .then((data) => {
                    this.currentTs = data.ts;
                    return data;
                })
                .then(this._whenPostsLoaded.bind(this))
                .then((posts) => {
                    this.setState({ posts: this.state.posts.concat(posts), isLoading: false });
                });
        }, SCROLL_DEBOUNCE_TIME);

        window.onscroll = () => {

            if (window.innerHeight + document.documentElement.scrollTop > document.documentElement.offsetHeight - 300) {
                if (this.state.isLoading) return;
                this.handleScroll();
            }
        };
    }

    handleScroll() {
        this._fetchPostsOnScrollDebounced();
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="btn-group" role="group" aria-label="Type controls">
                            <button type="button" className="btn btn-default btn-filter btn-filter--type active" data-filtertype="all" onClick={this.filterClick}>All</button>
                            <button type="button" className="btn btn-default btn-filter btn-filter--type" data-filtertype="audio" onClick={this.filterClick}>Audio</button>
                            <button type="button" className="btn btn-default btn-filter btn-filter--type" data-filtertype="video" onClick={this.filterClick}>Video</button>
                            <button type="button" className="btn btn-default btn-filter btn-filter--type" data-filtertype="image" onClick={this.filterClick}>Image</button>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="btn-group" role="group" aria-label="Category controls">
                            {this.state.categories.map(category => <button key={category.id} type="button" className="btn btn-default btn-filter btn-filter--category" data-filtercategory={category.name.toLowerCase()} onClick={this.filterClick}>{category.name}</button>)}
                        </div>
                    </div>
                </div>
                <div ref={this.element} className="row my-shuffle">
                    <LoadingOverlay
                        active={this.state.isLoading}
                        styles={{
                            wrapper: {
                                'width': '100%',
                                'height': '100%',
                                'z-index': '99999',
                                'position': 'fixed'                            }
                        }}
                        spinner
                        text='Loading...' ></LoadingOverlay>
                    {this.state.posts.map((image, index) => {
                        return (<div key={index} className="col-lg-3 col-md-4 col-sm-6 media-item" data-type={image.type} data-category={image.category}>
                            <HomepagePost {...image} />
                        </div>)
                    })}
                    <div ref={this.sizer} className="col-lg-3 col-md-4 col-sm-6 photo-grid__sizer"></div>
                </div>

            </div>
        );
    }

    _fetchPosts = () => {
        console.log("fetching posts...");
        this.setState({ isLoading: true });

        return new Promise((resolve) => {
            fetch(API + POSTS_ENDPOINT + `?type=${encodeURIComponent(this.currentType)}&category=${encodeURIComponent(this.currentCategory)}&count=${POST_COUNT}&to=${this.currentTs}`)
                .then(response => response.json())
                .then(data => resolve(data));
        });
    }

    _fetchCategories = () => {
        console.log("fetching categories...");

        return new Promise((resolve) => {
            fetch(API + CATEGORIES_ENDPOINT)
                .then(response => response.json())
                .then(data => resolve(data));
        });
    }

    _whenPostsLoaded(data) {
        let posts = data.posts;
        return Promise.all(posts.map(post => new Promise((resolve) => {
            const image = document.createElement('img');
            image.src = post.src;

            if (image.naturalWidth > 0 || image.complete) {
                resolve(post);
            } else {
                image.onload = () => {
                    resolve(post);
                };
            }
        })));
    }

    filterClick = (event) => {
        if (event.target.dataset.filtertype !== undefined) {
            this._handleTypeFilter(event.target);
        }
        if (event.target.dataset.filtercategory !== undefined) {
            this._handleCategoryFilter(event.target);
        }
    }

    _handleTypeFilter = (target) => {
        let type = target.dataset.filtertype
        let filterTypeButtons = document.getElementsByClassName("btn-filter--type");
        for (let i = 0; i < filterTypeButtons.length; i++) {
            filterTypeButtons[i].classList.remove("active");
        }
        target.classList.add("active");

        let filterBy;
        if (type === 'all' && this.currentCategory === 'all') {
            filterBy = this.shuffle.ALL_ITEMS;
        } else if (type === 'all') {
            filterBy = (element) => {
                return this.currentCategory === element.dataset.category;
            };
        } else if (this.currentCategory === 'all') {
            filterBy = (element) => {
                return type === element.dataset.type;
            };
        } else {
            filterBy = (element) => {
                return type === element.dataset.type && this.currentCategory === element.dataset.category;
            };
        }

        this.shuffle.filter(filterBy);
        this.shuffle.on(Shuffle.EventType.LAYOUT, () => {
            this.currentType = type;
        });
    }

    _handleCategoryFilter = (target) => {
        let category = target.dataset.filtercategory
        let filterCategoryButtons = document.getElementsByClassName("btn-filter--category");
        for (let i = 0; i < filterCategoryButtons.length; i++) {
            filterCategoryButtons[i].classList.remove("active");
        }
        target.classList.add("active");

        let filterBy;
        if (category === 'all' && this.currentType === 'all') {
            filterBy = this.shuffle.ALL_ITEMS;
        } else if (category === 'all') {
            filterBy = (element) => {
                return this.currentType === element.dataset.type;
            };
        } else if (this.currentType === 'all') {
            filterBy = (element) => {
                return category === element.dataset.category;
            };
        } else {
            filterBy = (element) => {
                return category === element.dataset.category && this.currentType === element.dataset.type;
            };
        }

        this.shuffle.filter(filterBy);
        this.shuffle.on(Shuffle.EventType.LAYOUT, () => {
            this.currentCategory = category;
        });
    }

    componentDidMount() {
        AOS.init();

        this.shuffle = new Shuffle(this.element.current, {
            easing: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
            itemSelector: '.media-item',
            sizer: this.sizer.current,
        });

        this._fetchPosts()
            .then((data) => {
                this.currentTs = data.ts;
                return data;
            })
            .then(this._whenPostsLoaded.bind(this))
            .then((posts) => {
                this.setState({ posts, isLoading: false });
            });
    }

    componentDidUpdate() {
        this.shuffle.resetItems();
    }

    componentWillUnmount() {
        this.shuffle.destroy();
        this.shuffle = null;

        this._fetchPostsOnScrollDebounced.cancel();
    }
}

export default InfiniteWall; 