
import { } from 'jasmine';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadComponent } from './download.component';

//test imports
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';


describe('DownloadComponent', () => {
  let component: DownloadComponent;
  let fixture: ComponentFixture<DownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DownloadComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component save csv', () => {
    expect(component).toBeTruthy();
  });

  it("Test csv save method called with lower limit of 20 and upper limit of 30", function () {
    // Ensure the spy was called with the correct number of arguments
    // In this case, no arguments
    //arrange
    let addSpy = spyOn<any>(component, 'downloadCsv');
   
    //act
    component.downloadCsv('20','30');

    //assert
    expect(addSpy).toHaveBeenCalledWith('20','30');
  });
});
