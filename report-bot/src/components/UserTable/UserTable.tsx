import styled from "@emotion/styled";
import {
    TableCell,
    tableCellClasses,
    TableRow,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableBody,
    TablePagination,
    Skeleton,
    Box,
    TextField,
    MenuItem,
    CircularProgress,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import User from "../../api/User";
import UserStatisticResponse from "../../api/models/response/UserStatisticResponse";
import ProjectResponse from "../../api/models/response/ProjectResponse";
import Project from "../../api/Project";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#D9D9D9',
        color: '#000000',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: '#F3F3F3',
    },
}));

const UserTable = () => {
    const [users, setUsers] = useState<UserStatisticResponse[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(7);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [projects, setProjects] = useState<ProjectResponse[]>([]);

    useEffect(() => {
        const getUsers = async () => {
            setLoading(true);
            const response = await User.getAll(filter === 'none' ? '' : filter);
            if (response.success) {
                setUsers(response.data ?? []);
            }
            setLoading(false);
        };
        getUsers();
    }, [filter]);

    useEffect(() => {
        const getProjects = async () => {
            const response = await Project.getAll();
            if (response.success) {
                setProjects(response.data ?? []);
            }
        };
        const calculateRowsPerPage = () => {
            const containerHeight = document.getElementById('dataGridContainer')?.clientHeight ?? 0;
            const rowHeight = 72;
            const calculatedRows = Math.floor(containerHeight / rowHeight);
            setRowsPerPage(calculatedRows);
        };

        getProjects();
        calculateRowsPerPage();

        window.addEventListener('resize', calculateRowsPerPage);

        return () => window.removeEventListener('resize', calculateRowsPerPage);
    }, []);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const paginatedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box id="dataGridContainer" sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '90%',
            gap: '20px',
            height: '100%',
            padding: '20px',
        }}>
            <TextField
                id="outlined-select-currency"
                select
                defaultValue="none"
                onChange={(e) => { setFilter(e.target.value) }}
                sx={{
                    display: 'flex',
                    alignSelf: 'flex-start',
                    width: '200px',
                    height: '50px',
                    '& .MuiInputBase-root': {
                        backgroundColor: '#E1F3E0',
                        borderRadius: '15px',
                        height: '50px',
                    },
                }}>
                <MenuItem value='none'>
                    None
                </MenuItem>
                {projects.map((project) => (
                    <MenuItem value={project.name}>
                        {project.name}
                    </MenuItem>
                ))}
            </TextField>
            {loading ? (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                }}>
                    <CircularProgress />
                </Box>
            ) : (
                users.length === 0 ? (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                    }}>
                        <Typography sx={{
                            fontWeight: 'bold',
                            fontSize: '28px',
                        }}>No users found</Typography>
                        <Typography sx={{
                            textAlign: 'center',
                            width: '270px',
                            fontWeight: 'bold',
                            fontSize: '13px',
                        }}>Sorry, but no users was found for these filters.</Typography>
                    </Box>
                ) : (
                    <TableContainer component={Paper} sx={{ width: '100%', borderRadius: '10px 10px 0 0', border: '1px solid #d9d9d9' }}>
                        <Table sx={{ width: '100%' }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Username</StyledTableCell>
                                    <StyledTableCell align="right">FirstName</StyledTableCell>
                                    <StyledTableCell align="right">LastName</StyledTableCell>
                                    <StyledTableCell align="right">Time per day</StyledTableCell>
                                    <StyledTableCell align="right">Time per week</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedUsers.map((user) => (
                                    <StyledTableRow key={user.user.id}>
                                        <StyledTableCell component="th" scope="row">
                                            {user.user.username}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">{user.user.firstName}</StyledTableCell>
                                        <StyledTableCell align="right">{user.user.lastName}</StyledTableCell>
                                        <StyledTableCell align="right">{user.timePerDay}</StyledTableCell>
                                        <StyledTableCell align="right">{user.timePerWeek}</StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[rowsPerPage]}
                            component="div"
                            count={users.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={() => { }}
                        />
                    </TableContainer>
                )
            )}
        </Box>
    );
};

export default UserTable;
