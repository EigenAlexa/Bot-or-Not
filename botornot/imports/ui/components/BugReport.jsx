import Blaze from 'meteor/gadicc:blaze-react-component';
import React from 'react';
import { Bugs } from '/imports/api/bugs/bugs.js';
// import AutoForm from 'meteor/aldeed:autoform';

export default class BugReport extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.submitHook, 'submitHook');
    const onSuccessWrapper = () => {
      let submitHook = this.props.submitHook;
      return function(f, r) {
        if (!!submitHook) {
          submitHook();
        }
      }
      
    };
    let hookObject = {
      onSuccess: onSuccessWrapper(),
    };
    
     
    AutoForm.addHooks('submitBug', hookObject, true);
  }
  
  render() {
    window.Bugs = Bugs;
    let formOptions = {
      collection : "Bugs",
      id : "submitBug",
      type : "insert",
    };
    console.log(formOptions);
    return blazeToReact('quickForm')(formOptions);
    // return (
    //   <div>
    //     <title>Bot or Not</title>
    //     {/* deleted end section */}
    //     {/* Section Background */}
    //     <section className="section-background">
    //       <div className="container">
    //         <h2 className="page-header">
    //           get in touch with us
    //         </h2>
    //       </div> {/* /.container */}
    //     </section> {/* /.section-background */}
    //     <section className="section-wrapper contact-and-map">
    //       <div className="container">
    //         <div className="row">
    //           <div className="col-sm-24">
    //             <h2 className="section-title">
    //               Send Message
    //             </h2>
    //             <div className="form">
    //               <div className="input-group">
    //                 <input className="form-control border-radius border-right" type="text" placeholder="Name" required />
    //                 <span className="input-group-addon  border-radius custom-addon">
    //                   <i className="ion-person" />
    //                 </span>
    //               </div>
    //               <div className="input-group">
    //                 <input className="form-control border-radius border-right" name="email" type="email" placeholder="Email address" required />
    //                 <span className="input-group-addon  border-radius custom-addon">
    //                   <i className="ion-email" />
    //                 </span>
    //               </div>
    //               <div className="input-group">
    //                 <input className="form-control border-radius border-right" type="tel" placeholder="Phone number" />
    //                 <span className="input-group-addon  border-radius custom-addon">
    //                   <i className="ion-ios-telephone" />
    //                 </span>
    //               </div>
    //               <div className="input-group">
    //                 <textarea className="form-control border-radius border-right" rows={8} placeholder="Write Message" defaultValue={""} />
    //                 {/* <input type="text" name="text" rows="8" class="form-control border-radius border-right message" placeholder="Write Message"> */}
    //                 <span className="input-group-addon border-radius custom-addon">
    //                   <i className="ion-chatbubbles" />
    //                 </span>
    //               </div>
    //               <button type="submit" className="btn btn-default border-radius custom-button">SEND MESSAGE </button>
    //             </div>
    //           </div> {/* /.col-sm-6 */}
    //         </div>
    //       </div>
    //     </section>
    //     {/* /.subscribe */}
    //     {/* deleted end div */}
    //     <footer>
    //       <div className="container">
    //         <div className="row">
    //           <div className="col-xs-4">
    //             <div className="text-left">
    //               © Copyright Bot or Not
    //             </div>
    //           </div>
    //           <div className="col-xs-4">
    //             Email us at <a href="example@example.com" />
    //           </div>
    //           <div className="col-xs-4">
    //             {/* <div class="top">
						// <a href="#header">
							// <i class="ion-arrow-up-b"></i>
						// </a>
					// </div> */}
    //           </div>
    //         </div>
    //       </div>
    //     </footer>
    //   </div>
    // );
  }
}

