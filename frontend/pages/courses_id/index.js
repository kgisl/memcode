import  { dogFetch } from '~/api/dogFetch';
import  { commonFetch } from '~/api/commonFetch';

import { Header } from '~/components/Header';
import { Footer } from '~/components/Footer';
import { Loading } from '~/components/Loading';
import { CourseActions } from '~/components/CourseActions';
import { Problem } from '~/components/Problem';

import css from './index.css';

class Page_courses_id extends React.Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string
    }).isRequired
  }

  state = {
    spe: {},
    status: null,
    response: null
  }

  componentDidMount = () =>
    commonFetch(
      spe => this.setState({ spe }),
      'GET', `/api/pages/courses/${this.props.params.id}`
    )

  deleteProblem = (id) =>
    dogFetch((request) => this.setState({ ...request }),
      'DELETE', `/api/problems/${id}`
    ).then(() => {
      this.setState({ status: null });
      const idFilter = (val) => !(val.id === id);
      const newSpe = {
        ...this.state.spe,
        payload: this.state.spe.payload.filter(idFilter)
      };
      this.setState({ spe: newSpe });
    })

  render = () =>
    <main className={css.main}>
      <Header/>

      <div className="container">
        <CourseActions courseId={this.props.params.id} ifCourseDescriptionIsDisplayed/>

        <Loading spe={this.state.spe}>{(problems) =>
          <section className="problems">
            {problems.map((problem) =>
              <div>
                <Problem
                  mode="show"
                  problemContent={problem.content}
                  problemType={problem.type}
                />
                { this.state.status ?
                  <i className="fa fa-clock-o"/>
                :
                  <button className="button -black -fade-out-on-hover" onClick={() => this.deleteProblem(problem.id)}>
                    Remove
                  </button>
                }
              </div>
            )}
          </section>
        }</Loading>
      </div>

      <Footer/>
    </main>
}

export { Page_courses_id };
