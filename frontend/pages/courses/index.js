import * as fuzzy from 'fuzzy';
import { commonFetch } from '~/api/commonFetch';

import { Helmet } from 'react-helmet';
import { Header } from '~/components/Header';
import { Footer } from '~/components/Footer';
import { Loading } from '~/components/Loading';
import { ListOfSimpleCourses } from '~/components/ListOfSimpleCourses';
import { ProfileNavigation } from '~/components/ProfileNavigation';

import css from './index.css';

class Page_courses extends React.Component {
  state = {
    speGetCourses: {},
    searchString: '',
    searchRe: new RegExp()
  }

  componentDidMount = () =>
    commonFetch(
      spe => this.setState({ speGetCourses: spe }),
      'GET', '/api/pages/courses'
    )

  updateSearchString = (event) => {
    const newSearchString = event.target.value;
    this.setState({ searchString: newSearchString });
    this.setState({ searchRe: new RegExp(this.state.searchString) });
  }

  filter = (coursesData) => {
    const options = {
      pre: '<mark>',
      post: '</mark>',
      extract: (courseData) => courseData.course.title // filter by what?
    };
    const fuzzyCoursesData = fuzzy.filter(this.state.searchString, coursesData, options);

    // [{ original, string ('Engli<b>sh</b>') }]
    return fuzzyCoursesData.map((fuzzyCourseData) => ({
      course: {
        ...fuzzyCourseData.original.course,
        title: fuzzyCourseData.string
      },
      amountOfProblems: fuzzyCourseData.original.amountOfProblems
    }));
  }

  dogFilter = (courses) => courses.filter((item) => this.state.searchRe.test(item.course.title));

  render = () =>
    <main className={css.main}>
      <Header/>
      <ProfileNavigation/>
      <div className="container">
        <section className="search">
          <i className="fa fa-search"/>
          <input
            placeholder="Search For Some Course To Learn"
            onChange={this.updateSearchString}
            value={this.state.searchString}
            type="text"
          />
        </section>

        <Loading spe={this.state.speGetCourses}>{coursesData =>
          <div>
            <ListOfSimpleCourses coursesData={this.filter(coursesData)}/>
            <ListOfSimpleCourses coursesData={this.dogFilter(coursesData)}/>
          </div>
        }</Loading>
      </div>
      <Footer/>

      <Helmet>
        <title>Memcode | All courses</title>
        <meta name="description" content="Learn existing courses on programming, maths and physics, or create your own."/> :
      </Helmet>
    </main>
}

export { Page_courses };
