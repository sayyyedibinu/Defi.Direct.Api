import React from "react";
import ReactPaginate from 'react-paginate';

import './FooterPaginationStyle.css';


export default class FooterPaginationComponent extends React.Component{
    getFrom = () => {
        return ( this.props.currentPage === 0 ? 1 : ( this.props.recordsPerPage === 'All' ? 1 : this.props.currentPage * this.props.recordsPerPage) )
    }
    getTo = () => {
        return (
            ( this.props.recordsPerPage === 'All' ? this.props.dataSet.length : (this.props.currentPage === 0 ? (1 * this.props.recordsPerPage) : ((this.props.currentPage + 1) * this.props.recordsPerPage)) ) > this.props.dataSet.length ? this.props.dataSet.length : ( this.props.recordsPerPage === 'All' ? this.props.dataSet.length : (this.props.currentPage === 0 ? (1 * this.props.recordsPerPage) : ((this.props.currentPage + 1) * this.props.recordsPerPage)) )
        )
    }
    render(){
        return(
            <div className="paginationWrapper">
                {
                    this.props.pageCount > 0 && 
                    <ReactPaginate previousLabel={<i className="material-icons">keyboard_arrow_left</i>}
                       nextLabel={<i className="material-icons">keyboard_arrow_right</i>}
                       breakLabel="..."
                       breakClassName={"break-me"}
                       pageCount={this.props.recordsPerPage === 'All' ? 0 : (this.props.dataSet.length / this.props.recordsPerPage)}
                       marginPagesDisplayed={1}
                       pageRangeDisplayed={3}
                       onPageChange={this.props.handlePageChange}
                       containerClassName={"pagination"}
                       subContainerClassName={"pages pagination"}
                       activeClassName={"active appSecondaryBGClr"} />
                }


               <span className="rowsPer">
                    Rows per page 
                    <select value={this.props.recordsPerPage} onChange={this.props.changeRecordsPerPage}>
                        {
                            this.props.dataSet.length > 10 && <option>10</option>
                        }
                        {
                            this.props.dataSet.length > 20 && <option>20</option>
                        }

                        <option>All</option>
                    </select>
                    {this.getFrom()} - {this.getTo()} of {this.props.dataSet.length}

                </span>

            </div>
        )
    }
}