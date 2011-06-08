require 'spec_helper'

describe PagesController do
  render_views

  before :each do
    RestGraph::TestUtil.setup
    # TestUtil.login(1234)    
  end

  after :each do
    RestGraph::TestUtil.teardown
  end

  describe "GET 'home'" do

    it "should be successful" do
      get 'home'
      response.should be_success
    end
    
    it "should have the right title" do
      get 'home'
      response.should have_selector('title', 
                              :content => "SUtalk: Friends Video Chat | Home")
    end
    
    it "should have a non-blank body" do
      get 'home'
      response.body.should_not =~ /<body>\s*<\/body>/
    end
  end
end
