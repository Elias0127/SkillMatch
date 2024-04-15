import * as React from "react";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EProfile(){
    const [profile, setProfile] = useState({
        firstName:'',
        lastName: '',
        phoneNum: '',
        email: '',
        location: ''
    });

    const navigate = useNavigate();

}



