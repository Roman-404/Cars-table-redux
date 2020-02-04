import React, {Component} from 'react';
import { connect } from 'react-redux';
import * as actions from './actions';
import TableItem from './table-item';
import { Paper, Table, TableHead, TableRow, TableContainer,
   TableCell, TablePagination, TableBody, LinearProgress } from '@material-ui/core';
import './styles.css'


class Cars extends Component {
  state = {
    images: [],
    page: 0,
    per_page: 10
};

componentDidMount() {
    this.props.loadCarsData(this.state.page, this.state.per_page, this.props.dealers)
    this.props.loadDealersData(this.state.per_page)
};

componentDidUpdate(prevProps, prevState) {
  const { page, per_page } = this.state
  const { dealers } = this.props
  if (prevState.page !== page || prevState.per_page !== per_page || prevProps.dealers !== dealers) {
    this.props.loadCarsData(page, per_page, dealers)
  };
  if (prevState.page !== page || prevState.per_page !== per_page) {
    this.props.updateDealersData(page, per_page, dealers)
  }
};

onItemClick = car => {
  if (!car) return null;
   const img = car.images.slice(0,5)
   this.setState({
      images: img
  });
};

handleChangePage = (event, page) => {
    this.setState({ page });
};

handleChangeRowsPerPage = event => {
    this.setState({ per_page: event.target.value });
};

render(){
    const {images, page, per_page} = this.state
    const {cars, cars_loading} = this.props
    return (
    <div>
        <h1 style={{color: 'red', textAlign: 'center'}}>Cars</h1>
        <Paper style={{width: '100%'}}>
           <TableContainer style={{maxHeight: 590}}>
              <Table stickyHeader aria-label="sticky table" size='small'>
                 <TableHead>
                    <TableRow>
                       {columns.map(column => (
                        <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                            >
                            {column.label}
                       </TableCell>
                     ))}
                   </TableRow>
                 </TableHead>
                    {cars.map(car =>
                     <TableBody
                         key={car.id}>
                       <TableItem
                         car={car}
                         onItemClick={this.onItemClick}/>
                     </TableBody>
                   )}
              </Table>
          </TableContainer>
         <TablePagination
              rowsPerPageOptions={[10, 25, 45]}
              component="div"
              count={this.props.x_total_count}
              page={page}
              rowsPerPage={per_page}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
      </Paper>
        {cars_loading ? 
          <LinearProgress style={{width: '100%'}}/>
        : null
        }
       <div className='all-img'>
      {images ? images.map(
        (img,i) => (<span key={i}><img src={img.url} width="350" alt="None"/></span>
      )) : null
    }
       </div>
    </div>)
    };
};

const mapStateToProps = state => {
    return {
      cars: state.carsData.cars,
      x_total_count: state.carsData.x_total_count,
      cars_loading: state.carsData.cars_loading,
      dealers: state.dealersData.dealers
    }
};

const columns = [
  { id: 'brand', label: 'Brand', minWidth: 50 },
  { 
    id: 'model',
    label: 'Model',
    minWidth: 50,
    align: 'center' },
  {
    id: 'grade',
    label: 'Grade',
    minWidth: 50,
    align: 'center'},
  {
    id: 'vin',
    label: 'VIN',
    minWidth: 100,
    align: 'center'},
  {
    id: 'dealer',
    label: 'Dealer',
    minWidth: 100,
    align: 'right'},
];
  
export default connect(mapStateToProps, actions)(Cars);